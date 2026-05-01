using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ClTechCore.Application.DTOs;

namespace ClTechCore.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(Guid id);
        Task<UserDto> CreateAsync(CreateUserDto createUserDto);
        Task<IEnumerable<UserDto>> GetAllAsync();
    }
}
