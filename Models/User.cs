using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitFolio.Data
{
    public class User : IdentityUser
    {
        public User()
        {
            FollowersJson = JsonConvert.SerializeObject(new string[0]);
            FollowingJson = JsonConvert.SerializeObject(new string[0]);
        }


        public string Name { get; set; }
        public string Avatar { get; set; }

        [Column(TypeName = "json")]
        public string FollowersJson { get; set; }

        [Column(TypeName = "json")]
        public string FollowingJson { get; set; }

        [NotMapped]
        public string[] Followers
        {
            get => FollowersJson == null ? new string[0] : JsonConvert.DeserializeObject<string[]>(FollowersJson);
            set => FollowersJson = JsonConvert.SerializeObject(value);
        }

        [NotMapped]
        public string[] Following
        {
            get => FollowingJson == null ? new string[0] : JsonConvert.DeserializeObject<string[]>(FollowingJson);
            set => FollowingJson = JsonConvert.SerializeObject(value);
        }
    }
}
