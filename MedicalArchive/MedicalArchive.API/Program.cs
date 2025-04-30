using Microsoft.AspNetCore.Authentication.JwtBearer;
using MedicalArchive.API.Application.Interfaces;
using MedicalArchive.API.Application.Services;
using MedicalArchive.API.DataAccess.Repositories;
using MedicalArchive.API.DataAccess;
using MedicalArchive.API.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;

namespace MedicalArchive.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ��������� ������ �� ����������
            var services = builder.Services;
            var configuration = builder.Configuration;

            // ������������ DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("MedicalArchive.API")));

            // ���������
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IDoctorAccessRepository, DoctorAccessRepository>();
            services.AddScoped<IDoctorAppointmentRepository, DoctorAppointmentRepository>();
            services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
            services.AddScoped<IReferralRepository, ReferralRepository>();
            services.AddScoped<IVaccinationRepository, VaccinationRepository>();
            services.AddScoped<IMedicalCertificateRepository, MedicalCertificateRepository>();

            // ������ �������
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IDoctorAccessService, DoctorAccessService>();
            services.AddScoped<IDoctorAppointmentService, DoctorAppointmentService>();
            services.AddScoped<IPrescriptionService, PrescriptionService>();
            services.AddScoped<IReferralService, ReferralService>();
            services.AddScoped<IVaccinationService, VaccinationService>();
            services.AddScoped<IMedicalCertificateService, MedicalCertificateService>();

            // ������������ FileService
            string uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            services.AddSingleton<IFileService>(provider => new FileService(uploadsPath));

            // ������������ JWT ��������������
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["Jwt:Issuer"],
                        ValidAudience = configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
                    };
                });

            // ������������ CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost", builder =>
                {
                    builder.WithOrigins("http://localhost:3000") // Frontend URL
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            // ������������ ���������� � ������ System.Text.Json
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.WriteIndented = true;
                });

            // Swagger
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Medical Archive API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            var app = builder.Build();

            // Middleware ������������
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            // ������� ����� ��� ������������ ���������
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
                RequestPath = "/files"
            });

            // CORS
            app.UseCors("AllowLocalhost");

            // �������������� � �����������
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // ��������� �������� ��� �����
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            app.Run();
        }
    }
}
