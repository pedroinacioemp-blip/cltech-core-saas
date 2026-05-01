using System.Threading.Tasks;
using ClTechCore.Application.Interfaces;
using ClTechCore.Infrastructure.Data;

namespace ClTechCore.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ClTechCoreDbContext _context;
        public IUserRepository Users { get; }
        public ISessionRepository Sessions { get; }

        public UnitOfWork(ClTechCoreDbContext context, IUserRepository users, ISessionRepository sessions)
        {
            _context = context;
            Users = users;
            Sessions = sessions;
        }

        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
