using System;
using System.Threading.Tasks;
using ClTechCore.Domain.Entities;

namespace ClTechCore.Application.Interfaces
{
    public interface ISessionRepository : IRepository<Session>
    {
        Task<Session?> GetByRefreshTokenAsync(string refreshToken);
    }
}
