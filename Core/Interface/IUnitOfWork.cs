using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interface
{
    //to dispose the context we use IDisposable
    public interface IUnitOfWork: IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;

        // to return the number of changes in db
        Task<int> Complete();
    }
}