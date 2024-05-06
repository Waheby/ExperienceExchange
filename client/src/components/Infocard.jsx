import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";

function Infocard() {
  return (
    <>
      <div className={ContentCSS.infocardContainer}>
        <div className={ContentCSS.leftContainer}>
          <div>
            <Icon
              className={ContentCSS.infoIcon}
              icon="healthicons:ui-user-profile-outline"
            />
          </div>
          <h1 style={{ fontSize: "25px" }}>Create Your Profile</h1>
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Perferendis culpa dolor sit atque nostrum incidunt dolorum,
              possimus sed harum a expedita, fugiat laudantium quas labore
              iusto. Ut sint nobis odio?
            </p>
          </div>
        </div>
        <div className={ContentCSS.leftContainer}>
          <div>
            <Icon
              className={ContentCSS.infoIcon}
              icon="ant-design:profile-outlined"
            />
          </div>
          <h1 style={{ fontSize: "25px" }}>Browse and Connect</h1>

          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Perferendis culpa dolor sit atque nostrum incidunt dolorum,
              possimus sed harum a expedita, fugiat laudantium quas labore
              iusto. Ut sint nobis odio?
            </p>
          </div>
        </div>
        <div className={ContentCSS.leftContainer}>
          <div>
            <Icon
              className={ContentCSS.infoIcon}
              icon="material-symbols:partner-exchange-outline-rounded"
            />
          </div>
          <h1 style={{ fontSize: "25px" }}>Engage and Exchange</h1>
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Perferendis culpa dolor sit atque nostrum incidunt dolorum,
              possimus sed harum a expedita, fugiat laudantium quas labore
              iusto. Ut sint nobis odio?
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Infocard;
