using Microsoft.EntityFrameworkCore;


using WPRProject.Tables;

namespace WPRProject
{
    public class CarsAndAllContext : DbContext
    {
        public DbSet<Business> Business { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<BusinessEmployee> BusinessEmployee { get; set; }
        public DbSet<Damage> Damage { get; set; }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Individual> Individual { get; set; }
        public DbSet<Mail> Mail { get; set; }
        public DbSet<Rent> Rent { get; set; }
        public DbSet<Subscription> Subscription { get; set; }
        public DbSet<SubscriptionCoverage> SubscriptionCoverage { get; set; }
        public DbSet<SubscriptionDiscount> SubscriptionDiscount { get; set; }
        public DbSet<SubscriptionOrder> SubscriptionOrder { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }


      
            public CarsAndAllContext(DbContextOptions<CarsAndAllContext> options)
                : base(options)
            {
            }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Customer>()
                    .HasDiscriminator<string>("Discriminator")
                    .HasValue<Individual>("Individual")
                    .HasValue<BusinessEmployee>("BusinessEmployee");
            }


        }
    }
