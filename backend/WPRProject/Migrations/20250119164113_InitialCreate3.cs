using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Subscription");

            migrationBuilder.AddColumn<string>(
                name: "SubscriptionType",
                table: "Subscription",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubscriptionType",
                table: "Subscription");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Subscription",
                type: "nvarchar(21)",
                maxLength: 21,
                nullable: false,
                defaultValue: "");
        }
    }
}
