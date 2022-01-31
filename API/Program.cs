using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using(var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                try
                {
                    //-- starting migrations at startup itself
                     var context = services.GetRequiredService<StoreContext>();
                     await context.Database.MigrateAsync();
                     //--
                     //++ data seeding
                     await StoreContextSeed.SeedAsync(context, loggerFactory);
                     //++

                    //appidentitydbcontext 
                     var userManager = services.GetRequiredService<UserManager<AppUser>>();
                     var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                     await identityContext.Database.MigrateAsync();
                     await ApplicationDbContextSeed.SeedUsersAsync(userManager);
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error ocurred during migration");
                    
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
