using MedicalArchive.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace MedicalArchive.API.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<DoctorAccess> DoctorAccesses { get; set; }
        public DbSet<DoctorAppointment> DoctorAppointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Referral> Referrals { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<MedicalCertificate> MedicalCertificates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Налаштування зв'язків між сутностями

            // User - DoctorAccess (як користувач)
            modelBuilder.Entity<DoctorAccess>()
                .HasOne(da => da.User)
                .WithMany(u => u.DoctorsWithAccess)
                .HasForeignKey(da => da.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - DoctorAccess (як лікар)
            modelBuilder.Entity<DoctorAccess>()
                .HasOne(da => da.Doctor)
                .WithMany(u => u.AccessToUsers)
                .HasForeignKey(da => da.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - DoctorAppointment
            modelBuilder.Entity<DoctorAppointment>()
                .HasOne(da => da.User)
                .WithMany(u => u.DoctorAppointments)
                .HasForeignKey(da => da.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Prescription
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.User)
                .WithMany(u => u.Prescriptions)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Referral
            modelBuilder.Entity<Referral>()
                .HasOne(r => r.User)
                .WithMany(u => u.Referrals)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Vaccination
            modelBuilder.Entity<Vaccination>()
                .HasOne(v => v.User)
                .WithMany(u => u.Vaccinations)
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - MedicalCertificate
            modelBuilder.Entity<MedicalCertificate>()
                .HasOne(mc => mc.User)
                .WithMany(u => u.MedicalCertificates)
                .HasForeignKey(mc => mc.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
