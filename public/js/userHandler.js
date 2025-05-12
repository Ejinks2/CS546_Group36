let makeAdmin = document.getElementById('makeAdmin');
let banUser = document.getElementById('userBan');

if (makeAdmin) {
    makeAdmin.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const confirmed = confirm("Are you sure you want to make this person an admin?");
            if (!confirmed) return;

            const adminButton = document.getElementById('submitAdmin');
            const username = adminButton.value;

            const updated = await fetch(`/users/${username}`, { method: "PATCH" });
        } catch (e) {
            return;
        }
        
    })
}

if (banUser) {
    banUser.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const confirmed = confirm("Are you sure you want to ban this person from the server?");
            if (!confirmed) return;

            const banButton = document.getElementById('submitBan');
            const username = banButton.value;

            console.log("hello there!");
            await fetch(`/users/${username}`, { method: "DELETE" }).then(response => {
                window.location.href = response.goTo;
            });
        } catch (e) {
            return;
        }
        
    })
}