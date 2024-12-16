using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedColumnNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Individual");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Customer",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Customer",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Customer",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Customer",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Customer");

            migrationBuilder.CreateTable(
                name: "Individual",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Adress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<int>(type: "int", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Individual", x => x.Id);
                });
        }
    }
}
