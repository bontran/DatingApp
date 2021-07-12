using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Collections.Generic;
using API.Entities;

using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    //this class is using for ge the data out of UserSeedDAta.json file into  database
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            //userDAta string of json text and we want deserialize that into an object
            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole>{
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                // using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("1234"));
                // user.PasswordSalt = hmac.Key;

                await userManager.CreateAsync(user, "Tin123");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Tin123");

            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
            //===> go to program.cs
        }
    }
}