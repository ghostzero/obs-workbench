# OBS Workbench (ALPHA)

With OBS Workbench you can control your OBS Studio from other devices in the same network. This is a web
application that runs in your browser and communicates with OBS Studio via WebSockets.

![Screenshot](docs/screenshots/electron_24GIwtPnu8.gif)

> This project is not affiliated with OBS or any of their partners. All copyrights reserved to their respective owners.
> I do not recommend using this in production environments as it is still in early development.

## Demo

You can try out the demo at [open.obs-workbench.com](https://open.obs-workbench.com/). Please note that this is a
pre-release version and may contain bugs.

## Goals

My goal is to create a web application that can be used to control OBS Studio from any device in the world to serve the
needs for IRL streamers. I want to make it as easy, secure and reliable as possible to control OBS Studio from anywhere.

## Features

- Fancy UI
- Display preview and program scenes
- Switch scenes between preview and program
- Toggle visibility and lock of sources

## Work in Progress (For Initial Beta Release)

I still have some few features to implement before I can call this a beta version. I will update this list as I go.

- [x] Support for Audio Mixer controls
- [x] Switching between Scene Collections
- [x] Switching between Profiles
- [x] Accounts System for additional features
- [x] Support for Simple Mode
- [ ] Adding and editing sources and scenes

### Planned Features (Coming Very Soon)

- [ ] SRT Ingest and Source for IRL streaming (WIP)
- [ ] Rentable OBS Studio instances (WIP)
- [ ] Build-in Ingress Server for localhost
- [ ] Support for Multiview
