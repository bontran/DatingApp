using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Collections.Generic;
using API.Entities;
using System.Security.Cryptography;
using System.Text;

namespace API.Data
{
    //this class is using for ge the data out of UserSeedDAta.json file into  database
    public class Seed
    {
        public static async Task SeedUsers(DataContext dataContext){
            if(await dataContext.Users.AnyAsync())return;

            //userDAta string of json text and we want deserialize that into an object
            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            foreach(var user in users){
                using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("1234"));
                user.PasswordSalt = hmac.Key;

                dataContext.Users.Add(user);
            }
            await dataContext.SaveChangesAsync();
            //===> go to program.cs
        }
    }
}