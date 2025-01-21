using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class updateBusinessEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Business_Customer_BusinessEmployeeId",
                table: "Business");

            migrationBuilder.DropIndex(
                name: "IX_Business_BusinessEmployeeId",
                table: "Business");

            migrationBuilder.DropColumn(
                name: "BusinessEmployeeId",
                table: "Business");

            migrationBuilder.AddColumn<int>(
                name: "BusinessId",
                table: "Customer",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_BusinessId",
                table: "Customer",
                column: "BusinessId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Business_BusinessId",
                table: "Customer",
                column: "BusinessId",
                principalTable: "Business",
                principalColumn: "BusinessId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Business_BusinessId",
                table: "Customer");

            migrationBuilder.DropIndex(
                name: "IX_Customer_BusinessId",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "BusinessId",
                table: "Customer");

            migrationBuilder.AddColumn<int>(
                name: "BusinessEmployeeId",
                table: "Business",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Business_BusinessEmployeeId",
                table: "Business",
                column: "BusinessEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Business_Customer_BusinessEmployeeId",
                table: "Business",
                column: "BusinessEmployeeId",
                principalTable: "Customer",
                principalColumn: "Id");
        }
    }
}
