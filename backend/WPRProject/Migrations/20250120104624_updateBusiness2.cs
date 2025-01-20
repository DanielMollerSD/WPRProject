using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class updateBusiness2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Password",
                table: "Business");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Business",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
