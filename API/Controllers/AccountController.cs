using API.Data;
using API.DTOs;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System.Linq;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager
        , ITokenService tokenService,
        IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("User is taken");
            //now we got all the property from registerDto we will map into our appuser object
            //which is our user now
            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();

            //save user and changes into the db
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);
            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!roleResult.Succeeded) return BadRequest(result.Errors);
            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnowAs = user.KnowAs,
                Gender = user.Gender
            };
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> login(LoginDto loginDto)
        {
            //make request to data base 
            var user = await _userManager.Users
            //bring back phto for user
            .Include(p => p.Photos)
            //get user
            .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            if (user == null) return Unauthorized("Invalid username");


            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized();


            //the passsword here is the password that we store in db
            //because it give us the same computed hash of the password 
            //because weare giving it the same key that was used when we created the password hash
            //in the first place
            // using var hmac = new HMACSHA512(user.PasswordSalt);
            // lay password trong logindto
            //if the logindto.password is the same as the password we used when we created
            //the original hash version of the password with the same password salt
            //then these should be identical
            // var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            // for (int i = 0; i < computedHash.Length; i++)
            // {
            //     if (computedHash[i] != user.PasswordHash[i])
            //     {
            //         return Unauthorized("Invalid password");
            //     }

            // }

            return new UserDto
            {

                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnowAs = user.KnowAs,
                Gender = user.Gender
            };
        }
        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}