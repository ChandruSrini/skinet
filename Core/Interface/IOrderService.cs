using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Interface
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, int delieveryMethod, string basketId, Address shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
        Task<IReadOnlyList<DeliverMethod>> GetDeliveryMethodsAsync();
    }
}