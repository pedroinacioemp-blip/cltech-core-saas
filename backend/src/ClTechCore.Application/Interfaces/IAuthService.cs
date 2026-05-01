using System.Threading.Tasks;
using ClTechCore.Application.DTOs;

namespace ClTechCore.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> AuthenticateAsync(LoginRequestDto loginRequest);
        Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request);
    }
}
