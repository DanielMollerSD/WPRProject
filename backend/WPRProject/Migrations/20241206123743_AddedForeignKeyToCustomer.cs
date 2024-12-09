using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class AddedForeignKeyToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "Individual",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "BusinessEmployee",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Individual_CustomerId",
                table: "Individual",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessEmployee_CustomerId",
                table: "BusinessEmployee",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_BusinessEmployee_Customer_CustomerId",
                table: "BusinessEmployee",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Individual_Customer_CustomerId",
                table: "Individual",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusinessEmployee_Customer_CustomerId",
                table: "BusinessEmployee");

            migrationBuilder.DropForeignKey(
                name: "FK_Individual_Customer_CustomerId",
                table: "Individual");

            migrationBuilder.DropIndex(
                name: "IX_Individual_CustomerId",
                table: "Individual");

            migrationBuilder.DropIndex(
                name: "IX_BusinessEmployee_CustomerId",
                table: "BusinessEmployee");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Individual");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "BusinessEmployee");
        }
    }
}
