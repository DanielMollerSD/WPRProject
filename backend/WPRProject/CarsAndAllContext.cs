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
        public DbSet<Vehicle> Vehicle { get; set; }



        public CarsAndAllContext(DbContextOptions<CarsAndAllContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SubscriptionOrder>()
                .HasOne(so => so.Business)               // One SubscriptionOrder has one Business
                .WithMany(b => b.SubscriptionOrders)     // One Business can have many SubscriptionOrders
                .HasForeignKey(so => so.BusinessId)      // Foreign key in SubscriptionOrder pointing to Business
                .OnDelete(DeleteBehavior.Cascade);       // Delete SubscriptionOrders when the Business is deleted

            modelBuilder.Entity<SubscriptionOrder>()
                .HasOne(so => so.Subscription)           // One SubscriptionOrder has one Subscription
                .WithMany(s => s.SubscriptionOrders)     // One Subscription can have many SubscriptionOrders
                .HasForeignKey(so => so.SubscriptionId)  // Foreign key in SubscriptionOrder pointing to Subscription
                .OnDelete(DeleteBehavior.Cascade);       // Delete SubscriptionOrders when the Subscription is deleted

            modelBuilder.Entity<Damage>()
                .HasOne(d => d.Vehicle)             // One Damage has one Vehicle
                .WithMany(v => v.Damages)           // One Vehicle can have many Damages
                .HasForeignKey(d => d.VehicleId)    // Foreign key in Damage pointing to Vehicle
                .OnDelete(DeleteBehavior.Cascade);  // Delete damages when the vehicle is deleted

            // Configure the foreign key relationship between Rent and Vehicle
            modelBuilder.Entity<Rent>()
                .HasOne(r => r.Vehicle)             // One Rent has one Vehicle
                .WithMany(v => v.Rents)             // One Vehicle can have many Rents
                .HasForeignKey(r => r.VehicleId)    // Foreign key in Rent pointing to Vehicle
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subscription>()
                .HasDiscriminator<string>("SubscriptionType")
                .HasValue<Subscription>("Base")
                .HasValue<SubscriptionCoverage>("Coverage")
                .HasValue<SubscriptionDiscount>("Discount");

            modelBuilder.Entity<Customer>()
                .HasDiscriminator<string>("Discriminator")
                .HasValue<Customer>("Customer")
                .HasValue<BusinessEmployee>("BusinessEmployee")
                .HasValue<Business>("Business");

            base.OnModelCreating(modelBuilder);
        }
    }
}