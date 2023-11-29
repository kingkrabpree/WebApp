using API.Entities;
using Company.ClassLibrary1;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;

//[Authorize]
public class UsersController : BaseApiController
{
    private DataContext _dataContext;
    public UsersController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        return await _dataContext.Users.ToListAsync();
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser?>> GetUsers(int id)
    {
        return await _dataContext.Users.FindAsync(id);
    }
}


