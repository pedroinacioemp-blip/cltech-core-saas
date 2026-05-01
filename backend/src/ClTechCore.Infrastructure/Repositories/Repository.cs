using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ClTechCore.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClTechCore.Infrastructure.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext Context;
        protected readonly DbSet<TEntity> Entities;

        public Repository(DbContext context)
        {
            Context = context;
            Entities = context.Set<TEntity>();
        }

        public async Task<TEntity?> GetByIdAsync(Guid id)
        {
            return await Entities.FindAsync(id);
        }

        public async Task<IEnumerable<TEntity>> ListAsync()
        {
            return await Entities.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await Entities.Where(predicate).AsNoTracking().ToListAsync();
        }

        public async Task AddAsync(TEntity entity)
        {
            await Entities.AddAsync(entity);
        }

        public void Update(TEntity entity)
        {
            Entities.Update(entity);
        }

        public void Remove(TEntity entity)
        {
            Entities.Remove(entity);
        }
    }
}
