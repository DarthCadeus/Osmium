# Osmium
A more elegant operating system for a more civilized age.

## About
Osmium is an operating system based on the internet. It (will) has (have) support for all of the functions of an operating system. It focuses on the **maximization of productivity** in an easy and customizable way.

## App System
Applications are made using web technologies. There are several types of applications:

### DefaultApp
These are applications that come with the OS itself. It extends `AppObject`, but has more permissions, including the full access of **everything**. However, third-party apps will not be allowed to create apps using the `DefaultApp` Object.

### AppObject
This is the root class for the app system, and it is run in an `<iframe>`, although the `<iframe>` is not sandboxed. It is assumed that these `<iframes>` are cross-origin. The OS does not communicate with the `<iframe>` in any way. These can be created by the user directly.

### TrustedApp
These are the third party variant of the `DefaultApp`. These will be sandboxed, although **not yet**. These applications will be able to access the system to some extent, but they will be contained within a dialog.

### IntegratedApp
`IntegratedApp`s are not bound by a dialog. Their html code is **directly appended to the site**. Their `js`, however, is fully sandboxed, and event handlers like `onclick` directly embedded into html may be removed, although **not yet**. 

---

Applications are prevented from conflicting with the concept of **namespaces**. These are done by modifying the API provided to the applications and adding a class of its `app id` to its container element. **id** attributes **will** be removed at some time in the future, although **not yet**.

## Attributions

### Images
#### Background pictures
Unsplash, through Unsplash wallpapers
#### File Icons
##### Folders
author website: http://www.thesquid.ink/flat-icons/

source: easyicon.net
##### Generic
author: Alessandro Roncone

author website: https://github.com/alecive/FlatWoken

source: easyicon.net
##### Other icons
author website: easyicon.net

source: easyicon.net
#### Apps
author: Owen li (a.k.a DarthCadeus, owner of this repository)

created with: canva.com
#### Folders
http://www.thesquid.ink/flat-icons/, easyicon.net

<!-- #### File Icons
Currently supported file icons:
- Folders
http://www.thesquid.ink/flat-icons/, easyicon.net
- EXE
Christian F. Burprich
http://chrfb.deviantart.com, easyicon.net
- HTML
Iconshock - Icon Sets
http://www.iconshock.com, easyicon.net
- JS
easyicon.net
- CSS
unknown, easyicon.net
- PY
openiconlibrary
http://openiconlibrary.sourceforge.net/, easyicon.net
- PNG
easyicon
easyicon.net
- JPG
easyicon
easyicon.net
- DOC(X)
easyicon
easyicon.net
- PPT(X)
- XLS(X)
- PAGES
- KEY
- NUMBERS
- PDF

Planned file icons
- C
- CPP -->

## Dependencies
* [Jquery](https://jquery.com/) (**CDN** version)
* [Jquery-Ui](http://jqueryui.com/) (**CDN** version)
* [Leancloud](http://leancloud.cn/) (**Local** version)
* [Jailed](https://github.com/asvd/jailed/) (**Local** version)
