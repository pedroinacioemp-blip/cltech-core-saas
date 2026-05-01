using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClTechCore.Application.DTOs;
using ClTechCore.Application.Interfaces;
using ClTechCore.Application.Exceptions;
using ClTechCore.Domain.Entities;
using BCryptNet = BCrypt.Net.BCrypt;

namespace ClTechCore.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<UserDto?> GetByIdAsync(Guid id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null || user.IsDeleted) return null;
            return Map(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _unitOfWork.Users.ListAsync();
            return users.Where(u => !u.IsDeleted).Select(Map);
        }

        public async Task<UserDto> CreateAsync(CreateUserDto createUserDto)
        {
            var existing = await _unitOfWork.Users.GetByEmailAsync(createUserDto.Email);
            if (existing != null) throw new DomainException("Email already registered.");

            var user = new User
            {
                Email = createUserDto.Email,
                FullName = createUserDto.FullName,
                PasswordHash = BCryptNet.HashPassword(createUserDto.Password),
                IsActive = true
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.CommitAsync();

            return Map(user);
        }

        private static UserDto Map(User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            IsActive = user.IsActive
        };
    }
}
