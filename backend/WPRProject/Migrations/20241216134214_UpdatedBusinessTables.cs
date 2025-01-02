using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedBusinessTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Business",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "Adress",
                table: "Business",
                newName: "Email");

            migrationBuilder.AddColumn<string>(
                name: "BusinessAddress",
                table: "Business",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BusinessName",
                table: "Business",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BusinessPostalCode",
                table: "Business",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BusinessAddress",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "BusinessName",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "BusinessPostalCode",
                table: "Business");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Business",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Business",
                newName: "Adress");
        }
    }
}
