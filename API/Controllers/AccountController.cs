﻿using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Company.ClassLibrary1;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly DataContext _dataContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenservice _tokenService;
    private readonly IMapper _mapper;

    public AccountController(UserManager<AppUser> userManager, ITokenservice tokenService, IMapper mapper)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
    }
    private async Task<bool> isUserExists(string username)
    {
        return await _dataContext.Users.AnyAsync(user => user.UserName == username.ToLower());
    }
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users
                        .Include(photo => photo.Photos)
                        .SingleOrDefaultAsync(user =>
                            user.UserName == loginDto.Username!.ToLower());

        if (user is null) return Unauthorized("invalid username");
        var appUser = await _userManager.CheckPasswordAsync(user, loginDto.Password!);
        if (!appUser) return BadRequest("invalid password");

        // using var hmacSHA256 = new HMACSHA256(user.PasswordSalt!);

        // var computedHash = hmacSHA256.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password!.Trim()));
        // for (int i = 0; i < computedHash.Length; i++)
        // {
        //     if (computedHash[i] != user.PasswordHash?[i]) return Unauthorized("invalid password");
        // }
        return new UserDto
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url,
            Aka = user.Aka,
            Gender = user.Gender
        };
    }
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await isUserExists(registerDto.Username!))
            return BadRequest("username is already exists");
        var user = _mapper.Map<AppUser>(registerDto);
        using var hmacSHA256 = new HMACSHA256();
        //var user = new AppUser
        // {
        user.UserName = registerDto.Username!.Trim().ToLower();
        // user.PasswordHash = hmacSHA256.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password!.Trim()));
        // user.PasswordSalt = hmacSHA256.Key;
        // };
        _dataContext.Users.Add(user);
        await _dataContext.SaveChangesAsync();
        var appUser = await _userManager.CreateAsync(user, registerDto.Password!);//
        if (!appUser.Succeeded) return BadRequest(appUser.Errors);//<--
        var role = await _userManager.AddToRoleAsync(user, "Member");//
        if (!role.Succeeded) return BadRequest(role.Errors);//
        return new UserDto
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url,
            Aka = user.Aka,
            Gender = user.Gender
        };
    }

    private async Task<bool> IsUserExists(string username) =>
        await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
}