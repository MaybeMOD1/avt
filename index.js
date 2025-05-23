const { Client, GatewayIntentBits, Partials, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!دمج') || message.author.bot) return;

    const attachments = message.attachments.map(att => att);
    if (attachments.length !== 2) {
        return message.reply("أرسل صورتين فقط: الأفاتار ثم البنر.");
    }

    const avatarURL = attachments[0].url;
    const bannerURL = attachments[1].url;

    const avatarImg = await canvas.loadImage(avatarURL);
    const bannerImg = await canvas.loadImage(bannerURL);
    const frame = await canvas.loadImage('./Calm.png');

    const canvas = Canvas.createCanvas(frame.width, frame.height);
    const ctx = canvas.getContext('2d');

    // البنر
    ctx.drawImage(bannerImg, 0, 0, frame.width, frame.height);

    // دمج القالب فوق البنر
    ctx.drawImage(frame, 0, 0, frame.width, frame.height);

    // إعداد الأفاتار كدائرة
    const avatarSize = 180;
    const avatarX = 55;
    const avatarY = 110;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    const buffer = canvas.toBuffer();
    const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });

    const embed = new EmbedBuilder()
        .setTitle('تم تجهيز الصورة')
        .setDescription('اضغط الزر لمشاهدتها')
        .setImage('attachment://profile.png')
        .setColor(0x2ecc71);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('show_image')
            .setEmoji('👁‍🗨')
            .setStyle(ButtonStyle.Secondary)
    );

    await message.channel.send({ embeds: [embed], files: [attachment], components: [row] });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return;
        if (interaction.customId === 'show_image') {
            await interaction.reply({
                files: [new AttachmentBuilder(buffer, { name: 'profile.png' })],
                ephemeral: true
            });
        }
    });
});

client.login('MTM3NTU0OTAyMjc5Mzg5NjAwNg.Gv4MZz.pVRgNFFsF3P25p-nogFZmZT83-YHfsbXHQJ800');
