using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository,

        IMapper mapper)
        {
            this._mapper = mapper;
            this._messageRepository = messageRepository;
            this._userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUserName();
            if (username == createMessageDto.RecipientUserName.ToLower())
                return BadRequest("You cannot send message to yourself");
            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var receipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUserName);
            if (receipient == null) return NotFound();
            var message = new Message
            {
                Sender = sender,
                Receipient = receipient,
                SenderUsername = sender.UserName,
                ReceipientUserName = receipient.UserName,
                Content = createMessageDto.Content
            };
            _messageRepository.AddMessage(message);
            if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
            return BadRequest("Failed to send message");
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser(
        [FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize,
                messages.TotalCount, messages.TotalPages);

            return messages;
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUserName();
            return Ok(await _messageRepository.GetMessageThreat(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUserName();
            var message = await _messageRepository.GetMessage(id);
            if (message.Sender.UserName != username && message.Receipient.UserName != username)
                return Unauthorized();
            if (message.Sender.UserName == username) message.SenderDeleted = true;
            if (message.Receipient.UserName == username) message.ReceipientDeleted = true;
            if (message.SenderDeleted && message.ReceipientDeleted)
                _messageRepository.DeleteMessage(message);
            if (await _messageRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem deleting the message");
        }
    }
}