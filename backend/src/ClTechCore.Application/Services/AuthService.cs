using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ClTechCore.Application.DTOs;
using ClTechCore.Application.Interfaces;
using ClTechCore.Application.Services;
using ClTechCore.Application.Exceptions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using BCryptNet = BCrypt.Net.BCrypt;

namespace ClTechCore.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IUnitOfWork unitOfWork, IOptions<JwtSettings> jwtOptions)
        {
            _unitOfWork = unitOfWork;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<AuthResponseDto> AuthenticateAsync(LoginRequestDto loginRequest)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(loginRequest.Email);
            if (user == null || !user.IsActive || !BCryptNet.Verify(loginRequest.Password, user.PasswordHash))
            {
                throw new DomainException("Invalid credentials.");
            }

            var refreshToken = Guid.NewGuid().ToString();
            var session = new Domain.Entities.Session
            {
                UserId = user.Id,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
                IpAddress = string.Empty,
                UserAgent = string.Empty
            };

            await _unitOfWork.Sessions.AddAsync(session);
            await _unitOfWork.CommitAsync();

            return new AuthResponseDto
            {
                AccessToken = GenerateToken(user),
                RefreshToken = refreshToken,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var session = await _unitOfWork.Sessions.GetByRefreshTokenAsync(request.RefreshToken);
            if (session == null || session.ExpiresAt < DateTime.UtcNow)
            {
                throw new DomainException("Refresh token invalid or expired.");
            }

            var user = await _unitOfWork.Users.GetByIdAsync(session.UserId);
            if (user == null || !user.IsActive)
            {
                throw new DomainException("Invalid refresh token owner.");
            }

            session.RefreshToken = Guid.NewGuid().ToString();
            session.ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
            _unitOfWork.Sessions.Update(session);
            await _unitOfWork.CommitAsync();

            return new AuthResponseDto
            {
                AccessToken = GenerateToken(user),
                RefreshToken = session.RefreshToken,
                Email = user.Email
            };
        }

        private string GenerateToken(Domain.Entities.User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
