using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class UpdataBusiness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
