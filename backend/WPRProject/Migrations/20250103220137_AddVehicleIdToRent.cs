using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WPRProject.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleIdToRent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LicenseNumber",
                table: "Rent");

            migrationBuilder.AddColumn<string>(
                name: "LicensePlate",
                table: "Rent",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "VehicleId",
                table: "Rent",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Rent_VehicleId",
                table: "Rent",
                column: "VehicleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rent_Vehicles_VehicleId",
                table: "Rent",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rent_Vehicles_VehicleId",
                table: "Rent");

            migrationBuilder.DropIndex(
                name: "IX_Rent_VehicleId",
                table: "Rent");

            migrationBuilder.DropColumn(
                name: "LicensePlate",
                table: "Rent");

            migrationBuilder.DropColumn(
                name: "VehicleId",
                table: "Rent");

            migrationBuilder.AddColumn<string>(
                name: "LicenseNumber",
                table: "Rent",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");
        }
    }
}
