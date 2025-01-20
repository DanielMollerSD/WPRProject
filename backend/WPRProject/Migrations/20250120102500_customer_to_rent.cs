using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class customer_to_rent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "Rent",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Rent_CustomerId",
                table: "Rent",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rent_Customer_CustomerId",
                table: "Rent",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rent_Customer_CustomerId",
                table: "Rent");

            migrationBuilder.DropIndex(
                name: "IX_Rent_CustomerId",
                table: "Rent");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Rent");
        }
    }
}
