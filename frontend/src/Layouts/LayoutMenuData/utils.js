// utils.js

export function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
        const ul = document.getElementById("two-column-menu");
        const iconItems = ul.querySelectorAll(".nav-icon.active");
        let activeIconItems = [...iconItems];
        activeIconItems.forEach((item) => {
            item.classList.remove("active");
            var id = item.getAttribute("subitems");
            if (document.getElementById(id))
                document.getElementById(id).classList.remove("show");
        });
    }
}
