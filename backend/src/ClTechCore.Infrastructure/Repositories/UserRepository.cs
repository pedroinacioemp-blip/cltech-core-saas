using System.Threading.Tasks;
using ClTechCore.Application.Interfaces;
using ClTechCore.Domain.Entities;
using ClTechCore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ClTechCore.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ClTechCoreDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await Entities.Include(u => u.UserRoles)
                                 .Include(u => u.Sessions)
                                 .Include(u => u.ApiKeys)
                                 .FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
