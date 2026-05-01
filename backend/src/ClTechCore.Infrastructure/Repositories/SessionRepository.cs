using System.Threading.Tasks;
using ClTechCore.Application.Interfaces;
using ClTechCore.Domain.Entities;
using ClTechCore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ClTechCore.Infrastructure.Repositories
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        public SessionRepository(ClTechCoreDbContext context) : base(context)
        {
        }

        public async Task<Session?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await Entities.FirstOrDefaultAsync(s => s.RefreshToken == refreshToken);
        }
    }
}
