using System;
using System.Threading.Tasks;

namespace ClTechCore.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ISessionRepository Sessions { get; }
        Task<int> CommitAsync();
    }
}
