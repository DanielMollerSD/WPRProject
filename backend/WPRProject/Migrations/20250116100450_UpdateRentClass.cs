using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRentClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Verified",
                table: "Rent");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Rent",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Rent");

            migrationBuilder.AddColumn<bool>(
                name: "Verified",
                table: "Rent",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
