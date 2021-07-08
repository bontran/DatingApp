using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using API.Extensions;
using System;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Http.Headers;
using API.Helpers;

namespace API.Controllers

{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _PhotoService;

        public UsersController(IUserRepository userRepository, IMapper mapper,
        IPhotoService PhotoService)
        {

            _PhotoService = PhotoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        //get userparam from query
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            userParams.CurrentUserName = User.GetUserName();
            if (string.IsNullOrEmpty(userParams.Gender)) userParams.Gender = user.Gender == "male" ? "false" : "male";
            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize,
                users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        //api/users/3

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {

            return await _userRepository.GetMemberAsync(username);
        }
        //httpput use to update to server
        [HttpPut]
        //client has all the data readted to the entity we are about to update
        //so we dont need to return the objects back from our API because the client 
        //is telling the api what its updating so it has everything it needs and we dont 
        //need to return the user object from this 
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //we actually want to get it from wat we are authenticating again, which is the token
            //we have access to a claims principle of the user 
            //now this contains information about their identity and what we want to do inside here
            //is find the claim that matches the name identifier, which is the claim that we give 
            //the user in that token
            //User.FindFirst(ClaimTypes.NameIdentifier)?.Value; it give us user's username 
            //from the token that the api uses to authenticate this user
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            //the overload that we are going to use allows us to pass in the member update DTO

            //instead user.City = memberUpdateDto.City
            _mapper.Map(memberUpdateDto, user);
            //now our user object is flagged as being updated by entity framework
            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Fail to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {

            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            //result back for photo service 
            var result = await _PhotoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            //create a new photo
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            //check if the users alreay got any phots in their collection
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            //return the photo
            if (await _userRepository.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDto>(photo);
                return CreatedAtRoute("GetUser", new { Username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding phot");
        }
    }
}