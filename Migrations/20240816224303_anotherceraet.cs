using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitFolio.Migrations
{
    /// <inheritdoc />
    public partial class anotherceraet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FollowersJson",
                table: "AspNetUsers",
                type: "json",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FollowingJson",
                table: "AspNetUsers",
                type: "json",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FollowersJson",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FollowingJson",
                table: "AspNetUsers");
        }
    }
}
