using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(u =>u.Name).IsRequired().HasMaxLength(100);
            builder.Property(u =>u.Description).IsRequired().HasMaxLength(200);
            builder.Property(u =>u.Price).HasColumnType("decimal(18,2)");
            builder.Property(u =>u.PictureUrl).IsRequired();
            builder.HasOne(u => u.ProductBrand).WithMany()
                .HasForeignKey(u => u.ProductBrandId);
            builder.HasOne(u => u.ProductType).WithMany()
                .HasForeignKey(u => u.ProductTypeId);
            
        }
    }
}