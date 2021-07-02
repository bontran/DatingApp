using API.Entities;
using Microsoft.EntityFrameworkCore;
namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        //table in db
        //add this config to startup class so we can inject to datacontext to our app
        public DbSet<AppUser> Users { get; set; }

    }
}