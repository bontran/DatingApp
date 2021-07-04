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
namespace API.Controllers

{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }
        // add 2 endpoint
        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var user = await _userRepository.GetMembersAsync();

            return Ok(user);
        }

        //a[i/users/3

        [HttpGet("{username}")]
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
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);
            //the overload that we are going to use allows us to pass in the member update DTO

            //instead user.City = memberUpdateDto.City
            _mapper.Map(memberUpdateDto, user);
            //now our user object is flagged as being updated by entity framework
            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Fail to update user");
        }
    }
}