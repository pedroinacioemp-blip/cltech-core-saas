using System;
using System.Threading.Tasks;
using ClTechCore.Domain.Entities;

namespace ClTechCore.Application.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
