using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using Company.ClassLibrary1;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class AppServiceExtention
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration conf)
    {
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlite(conf.GetConnectionString("DefaultConnection"));
        });
        services.AddCors();
        services.AddScoped<ITokenservice, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(conf.GetSection("CloudinarySettings"));
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<LogUserActivity>();
        services.AddScoped<IlikesRepository, LikesRepository>();
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>();
        return services;
    }
}
