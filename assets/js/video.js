class Video {
  constructor(src, title, thumbnail, account, info, category) {
    this.src = src;
    this.title = title;
    this.thumbnail = thumbnail;
    this.account = account;
    this.info = info;
    this.category = category;
  }
  display(target) {
    const vidWrap = document.createElement("div");
    vidWrap.classList.add("video-wrap");

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("video-thumbnail");
    thumbnail.src = this.thumbnail;
    vidWrap.append(thumbnail);

    const link = document.createElement("a");
    link.classList.add("video-link");
    link.href = this.src;
    vidWrap.append(link);

    const title = document.createElement("h2");
    title.innerHTML = this.title;
    title.title = this.title;
    vidWrap.append(title);

    const account = document.createElement("a");
    account.innerHTML = this.account.title;
    account.href = this.account.url;
    vidWrap.append(account);

    const info = document.createElement("p");
    info.innerHTML = this.info;
    vidWrap.append(info);

    target.append(vidWrap);
  }
}
