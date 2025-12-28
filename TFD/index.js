document.addEventListener("DOMContentLoaded", () => {
  const xLink = document.getElementById("x-link");
  const discordLink = document.getElementById("discord-link");

  // X link
  const xUsername = "md_tfd_project"; 
  if (xLink) {
    xLink.href = `https://x.com/${xUsername}`;
  }

  // Discord link
  const discordInvite = "https://discord.gg/UUydEqvspq"; 
  if (discordLink) {
    discordLink.href = discordInvite;
  }
});
