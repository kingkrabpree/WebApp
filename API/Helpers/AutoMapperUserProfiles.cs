﻿
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;
#nullable disable
public class AutoMapperUserProfiles : Profile
{
    public AutoMapperUserProfiles()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(
                user => user.Age,
                opt => opt.MapFrom(user => user.BirthDate.CalculateAge())
            )
            .ForMember(
                user => user.MainPhotoUrl,
                opt => opt.MapFrom(
                    user => user.Photos.FirstOrDefault(photo => photo.IsMain).Url
                    )
                );
        CreateMap<Message, MessageDto>()
        .ForMember(
            msdto => msdto.SenderPhotoUrl,
            opt => opt.MapFrom(
                    ms => ms.Sender.Photos.FirstOrDefault(photo => photo.IsMain).Url
                )
        )
        .ForMember(
            msdto => msdto.RecipientPhotoUrl,
            opt => opt.MapFrom(
                    ms => ms.Recipient.Photos.FirstOrDefault(photo => photo.IsMain).Url
                )
        );
        CreateMap<DateTime, DateTime>()
            .ConvertUsing(datetime => DateTime.SpecifyKind(datetime, DateTimeKind.Utc));

        CreateMap<DateTime?, DateTime?>()
            .ConvertUsing(datetime => datetime.HasValue
                ? DateTime.SpecifyKind(datetime.Value, DateTimeKind.Utc)
                : null);
        CreateMap<Photo, PhotoDto>();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto, AppUser>();
    }
}
