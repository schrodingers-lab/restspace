import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonLabel,
  IonCard,
  IonCardContent,
} from '@ionic/react';

import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setSettings } from '../../store/actions';

const Settings = () => {
  const settings = Store.useState(selectors.getSettings);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Terms and Conditions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <p>
            <strong>Terms of Use</strong>
          </p>
          <p>
            <strong>Last Modified May 27, 2022.</strong>
          </p>
           <p>
            Thank you for choosing RestSpace. In these terms of use, 'us' 'we' or 'our' means
            ProRoute Pty Ltd (ACN 617 845 468) and our related bodies corporate. A reference to
            'you' or 'user' means you. In these terms of use, 'Services' means our
            website, <a href="http://www.restspace.com.au/">http://www.restspace.com.au/</a>, and
            related websites, (the 'Website'), the RestSpace mobile application, and
            related mobile applications (the 'Application'), and any related application
            programming interface (the 'API'). These terms of use set out the terms and
            conditions applicable to your access to and use of our Services.
          </p>
          <p>
            We are willing to provide the Services to you only if you accept all of the terms and
            conditions in these terms of use. Please read these terms and conditions carefully. You
            must not use the Services until you have agreed to these terms of use. By accessing any
            or all of the Services, you consent to these terms and conditions in respect of such use
            and any other arrangements that apply between us.
          </p>
          <p>
            We may change these terms of use from time to time by publishing changes to it in our
            Services, including on our Website. We encourage you to check our Services, including
            our Website, periodically to ensure that you are aware of our current terms of use. You
            agree to be bound by the varied terms of use by continuing to use the Services.
          </p>
          <p>
            <strong>Registration</strong>
          </p>
          <p>
            You may need to be a registered member to access our Services or certain features of our
            Services.
          </p>
          <p>
            When you register and activate your account, you will provide us with personal
            information such as your name, email address, telephone number and other contact
            details. You must ensure that this information is accurate and current. We will handle
            all personal information we collect in accordance with our Privacy Policy, which is
            available at http://www.restspace.com.au/privacy.html.
          </p>
          <p>
            When you register and activate your account, we will provide you with a username and
            password. You are responsible for keeping this username and password secure and are
            responsible for all use and activity carried out under this username. You agree:
          </p>
          <ul>
            <li >
              not to share, transfer, lease, assign or sublicense your username or password without
              our prior written consent;
            </li>
            <li>
              not to circumvent the password restrictions on any of the Services, nor allow others
              to do so on your behalf;
            </li>
            <li >
              not to use anyone else's username or password to access any of the Services; and
            </li>
            <li >
              to notify us immediately upon discovery or suspicion of compromise of the
              confidentiality of your username or password.
            </li>
          </ul>
          {/*<p>To create an account, you must be:</p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">at least 18 years of age;</li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              possess the legal right and ability to enter into a legally binding agreement with us;
              and
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              agree and warrant to use the Services in accordance with these terms of use.
            </li>
          </ul>
          <p>
            <strong>Collection Notice and Release of Information</strong>
          </p>
          <p>
            We collect personal information about you in order to respond to your enquiries, process
            your registration, process your orders and provide you with services and for purposes
            otherwise set out in our Privacy Policy, which is available at
            http://www.restspace.com.au/privacy.html.
          </p>
          <p>
            We may disclose that information to third parties that help us deliver our services
            (including information technology suppliers, communication suppliers and our business
            partners) or as required by law.
          </p>
          <p>
            If you do not provide this information, we may not be able to provide all of our
            services to you. We may also disclose your personal information to recipients that are
            located outside of Australia to third party suppliers, cloud providers and payment
            processors in the USA or elsewhere.
          </p>
          <p>Our Privacy Policy explains:</p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              how we store and use, and how you may access and correct your personal information;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              how you can lodge a complaint regarding the handling of your personal information; and
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              how we will handle any complaint.
            </li>
          </ul>
          <p>
            If you would like any further information about our privacy policies or practices,
            please contact us in the manner set out in our Privacy Policy.
          </p>
          <p>
            By providing your personal information to us, you consent to the collection, use,
            storage and disclosure of that information as described in the Privacy Policy and these
            Terms.
          </p>
          <p>
            <strong>Accuracy, completeness and timeliness of information</strong>
          </p>
          <p>
            The information on our Services is not comprehensive and is intended to provide a
            summary of the subject matter covered. While we use all reasonable attempts to ensure
            the accuracy and completeness of the information on our Services, to the extent
            permitted by law, including the Australian Consumer Law, we make no warranty regarding
            the information on our Services. You should monitor any changes to the information
            contained on our Services.
          </p>
          <p>
            We are not liable to you or anyone else if interference with or damage to your computer
            systems occurs in connection with the use of our Services or a linked website. You must
            take your own precautions to ensure that whatever you select for your use from our
            Services is free of viruses or anything else (such as worms or Trojan horses) that may
            interfere with or damage the operations of your computer systems.
          </p>
          <p>
            We may, from time to time and without notice, change or add to the Services (including
            these terms of use) or the information, products or services described in it. However,
            we do not undertake to keep the Services updated. We are not liable to you or anyone
            else if errors occur in the information on the Services or if that information is not
            up-to-date.
          </p>
          <p>
            <strong>Other Applicable Terms and Conditions</strong>
          </p>
          <p>
            For any supply of services from the Services, additional terms and conditions may apply.
            If you want to order services via any of the Services you must agree to the relevant
            terms and conditions applicable to such services. In case of any inconsistency between
            such terms and conditions and these Terms, those terms and conditions will prevail.
          </p>
          <p>
            If you purchase the Service through the Apple App Store, in addition to the terms of use
            set out here, your use of the Service is also subject to the Apple Inc
            (&lsquo;Apple') EULA (End User Licence Agreement) at
            http://www.apple.com/legal/itunes/appstore/dev/stdeula/ depending on your compatible
            device.
          </p>
          <p>If you purchase the Service through the Google Play Market:</p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              in addition to the terms of use set out here, your use of the Service is also subject
              to Google Play's Terms of Service
              http://play.google.com/intl/en_us/about/play-terms.html depending on your compatible
              device; and
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              the clause titled &ldquo;Apple Specific Terms&rdquo; will not apply to you.
            </li>
          </ul>
          <p style="page-break-after: avoid;">
            <strong>API</strong>
          </p>
          <p>
            We may provide access to the API as part of the Services for no additional fee. Subject
            to the other terms of this agreement, we grant you a non-exclusive, non-transferable,
            revocable license to interact with the API only for purposes of interacting with the
            Services as allowed by the API.
          </p>
          <p>
            You must not use the API in a manner, as reasonably determined by us, that exceeds
            reasonable request volume or constitutes excessive or abusive usage. If any of these
            occur, we can suspend or terminate your access to the API on a temporary or permanent
            basis.
          </p>
          <p>
            We will maintain and provide access to the API, unless we terminate the API for all
            customers with notice for any reason, including where it is not technically feasible or
            economically viable to continue granting access to the API.
          </p>
          <p>
            The API is provided on an 'AS IS', 'WHERE IS' and 'WHEN
            AVAILABLE' basis. We have no liability to you as a result of any change, temporary
            unavailability, suspension, or termination of access to the API.
          </p>
          <p>
            <strong>Linked Sites</strong>
          </p>
          <p>
            Our Services may contain links to websites operated by third parties. Those links are
            provided for convenience and may not remain current or be maintained. Unless expressly
            stated otherwise, we do not endorse and are not responsible for the content on those
            linked websites and have no control over or rights in those linked websites.
          </p>
          <p>
            <strong>Intellectual property rights</strong>
          </p>
          <p>
            Unless otherwise indicated, we own or license from third parties all rights, title and
            interest (including copyright, designs, patents, trademarks and other intellectual
            property rights) in the Services and in all of the material (including all text,
            graphics, logos, audio, data, images, photographs, animations, video, maps, databases,
            data models, spreadsheets, user interfaces, graphics components, icons, software
            applications, software development kits, application programming interfaces, software
            libraries, code samples, and other resources) (&lsquo;Content') made available on,
            or accessible through, the Services (&lsquo;RestSpace Content').
          </p>
          <p>
            Your use of the Services and use of and access to any RestSpace Content does not grant
            or transfer any rights, title or interest to you in relation to the Services or the
            RestSpace Content. However we do grant you a licence to access the Services and view the
            RestSpace Content on the terms and conditions set out in these terms of use and, where
            applicable, as expressly authorised by us and/or our third party licensors.
          </p>
          <p>
            Any reproduction or redistribution of any of the Services or the RestSpace Content is
            prohibited and may result in civil and criminal penalties. In addition, you must not
            copy the RestSpace Content to any other server, location or support for publication,
            reproduction or distribution is expressly prohibited.
          </p>
          <p>
            All other use, copying or reproduction of any of the Services, the RestSpace Content or
            any part of any of the Services or the RestSpace Content is prohibited, except to the
            extent permitted by law. However, you are permitted to make copies of any order, order
            confirmation, tax invoice or other document in connection with the supply of any
            services.
          </p>
          <p>
            <strong>Customer Content</strong>
          </p>
          <p>
            You retain all right, title, and interest in any Content that you provide to us in
            connection with the your use of the Services, and any results derived from the use of
            such Content (&lsquo;Customer Content'). Customer Content excludes any feedback,
            suggestions, or requests for improvements that you provide to us.
          </p>
          <p>
            You hereby grants us and our licensors (as the case requires) a non-exclusive,
            non-transferable, royalty-free, sub-licensable, worldwide right to host, run, and
            reproduce Customer Content solely for the purpose of enabling the your use, and other
            users' use, of the Services.
          </p>
          <p>
            Without your permission, we will not access, use, or disclose Customer Content except as
            reasonably necessary to support your use of the Services, or for any other purpose
            authorised by you in writing. If you access any Service with an application provided by
            a third party, we may disclose Customer Content to such third party as necessary to
            enable interoperation between the application, the Service, and the Customer Content. We
            may disclose Customer Content if required to do so by law or regulation or by order of a
            court or other government body, in which case we will reasonably attempt to limit the
            scope of disclosure. It is your sole responsibility to ensure that your Customer Content
            is suitable for use with the Services and for maintaining regular offline backups, as
            applicable.
          </p>
          <p>
            Upon termination of your right to use or access the Services, we will make your Customer
            Content available to you on request for a period of 30 days, unless you request a
            shorter window of availability, or we are legally prohibited from doing so. Thereafter,
            your right to access or use your Customer Content with the Services will end, and we
            will have no further obligations to store or return your Customer Content.
          </p>
          <p>You warrant that your Customer Content does not:</p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              contain any vulgar, obscene, indecent or unlawful material, including material that is
              likely to cause annoyance, or which is defamatory, racist, offensive, discriminatory,
              threatening, or pornographic;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              store or transmit any software viruses, worms, time bombs, Trojan horses, or any other
              computer code, files, denial-of-service, or programs designed to interrupt, destroy,
              or limit the functionality of any computer software, hardware, or telecommunications
              equipment;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              violate any law or regulation;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              include any Content or other material protected by intellectual property laws (or by
              rights of privacy or publicity) unless you have all necessary rights and consents to
              do so;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              infringe or misappropriate the rights of any third party;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              defame or libel us, our employees, other individuals or users of the Services; or
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              impact the normal operation, privacy, integrity or security of a third party's
              property, including a third party's accounts, domain names, URLs, websites, networks,
              systems, facilities, equipment, data, other information, or business operations.
            </li>
          </ul>
          <p>
            We may remove or delete any portions of your Customer Content if there is reason to
            believe that uploading the Customer Content to, or using it with, any or all of the
            Services materially violates these terms of use, including Restrictions on Use. If
            reasonable under these circumstances, we will notify you before removing your Customer
            Content. Except as set out in these terms of use, we take no responsibility for any
            Customer Content uploaded by any user to any of the Services.
          </p>
          <p>
            You indemnify us against all costs and liability incurred by us as a result of our
            possession, processing, use or other handling of any of your Customer Content,
            documentation or records, except to the extent that such costs and liability arise as a
            result of our breach of these terms of use.
          </p>
          <p style="page-break-after: avoid;">
            <strong>Use of the Services</strong>
          </p>
          <p>
            The Services may require network connectivity and location services to function
            properly. Please note that poor signal quality (dependent on your location and service
            provider) may slow down or prevent the Services from working at optimum speed. If you
            have concerns regarding the quality of your signal strength, please contact your mobile
            network service provider directly.
          </p>
          <p>
            You are solely responsible for paying all expenses you may incur when you access or use
            the Services, your internet or data service provider charges and any excess charges to
            that provider if you have a limit on the amount of data you can download together with
            all costs of the equipment and software you need to connect to and use the Services, and
            any other services included in the Services.
          </p>
          <p>
            We are not responsible if your equipment or software is not compatible with any of the
            Services.
          </p>
          <p>
            When you access the Services using a mobile device, you agree, as the relevant mobile
            service account holder, to us and our service providers collecting and using the
            location of your mobile handset to provide you with the Services.
          </p>
          <p>
            <strong>Restrictions on use</strong>
          </p>
          <p>The Services are for your personal use only. You must not, as applicable:</p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              yourself, or permit others to, sell, rent, lease, sub-license, lend, assign,
              time-share, distribute or otherwise make any of the Services available to any third
              party;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              reverse engineer, decompile, or disassemble any of the Services;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              modify, copy, distribute, transmit, display, perform, reproduce, publish, license,
              enhance, translate, alter, tamper with, upgrade, create derivative works from,
              transfer, or sell any of the whole or part of any of the Services, including the
              RestSpace Content, software, products or services contained within any of the
              Services;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              combine, integrate or incorporate the whole or any part of any the Services in any
              other software or system;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              remove, alter, obscure or deface any:
              <ul>
                <li style="margin-left: 35.45pt; text-indent: -18.0pt;">
                  patent, copyright, trademark, or proprietary rights notices of us or our
                  licensors;
                </li>
                <li style="margin-left: 35.45pt; text-indent: -18.0pt;">
                  trade mark, service mark, get up, livery, logo or branding, proprietary or
                  restricted use legend; or
                </li>
                <li style="margin-left: 35.45pt; text-indent: -18.0pt;">
                  disclaimer, warning, instruction or advisory notice,
                </li>
              </ul>
            </li>
          </ul>
          <p style="margin-left: 18.0pt;">
            which are contained in or affixed to any of the Services;
          </p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              do anything that would prejudice our right, title or interest in any of the Services;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              attempt to circumvent or modify any technological measure (such as digital rights
              management software on your handset) used to apply the terms of use;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              disrupt or try to disrupt any of the Services or use any of the Services or any
              RestSpace or ProRoute website to distribute software viruses or other harmful
              programs; or
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              infringe any applicable laws when accessing or using any of the Services.
            </li>
          </ul>
          <p>
            You must not use any of the Services, or any of the RestSpace Content, to further any
            commercial purpose, including any advertising or advertising revenue generation activity
            on your own website.
          </p>
          <p>
            <strong>Unacceptable activity</strong>
          </p>
          <p>
            You must not do any act that we would deem to be inappropriate, is unlawful or is
            prohibited by any laws applicable to our Services, including but not limited to:
          </p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              any act that would constitute a breach of either the privacy (including uploading
              private or personal information without an individual's consent) or any other of the
              legal rights of individuals;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              using any of the Services to defame or libel us, our employees or other individuals;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              uploading files that contain viruses that may cause damage to our property, including
              the Services, or the property of other individuals;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              posting or transmitting Customer Content or any other material to any of the Services
              that is non-authorised material including, but not limited to, material that is, in
              our opinion, likely to cause annoyance, or which is defamatory, racist, obscene,
              threatening, pornographic or otherwise or which is detrimental to or in violation of
              our systems or a third party's systems or network security.
            </li>
          </ul>
          <p>
            If we allow you to post any information to any of the Services, we have the right to
            take down this information at our sole discretion and without notice.
          </p>
          <p>
            <strong>Payments</strong>
          </p>
          <p>
            You must pay all fees as specified on the Service subscription confirmation, if not
            specified then payment is due upon receipt of an invoice. You are responsible for the
            payment of any and all sales, use, withholding, GST, HST, VAT and other similar taxes.
            If you do not pay the amounts within 7 days of the due date, we may suspend or terminate
            your access to the Services. In addition, you may be responsible for any additional
            charges related to the collection of outstanding amounts.
          </p>
          <p>
            You may pay for the Services online, and we may charge your credit card for all
            purchases and for any additional amounts owed to us. You must provide a valid credit
            card and hereby explicitly authorise and empower us to use the credit card for such
            purpose. If your credit card changes or expires, or is revoked, disputed or not valid
            for any other reason, we may suspend, terminate or both (without liability) your use of
            the Services upon 7 day notice sent to you via email (using your email address in the
            Service subscription confirmation).
          </p>
          <p>
            <strong>Termination</strong>
          </p>
          <p>
            We reserve the right to restrict, suspend or terminate without notice your access to the
            Service, or any feature of the Service, at any time without notice and we will not be
            responsible for any loss, cost, damage or liability that may arise as a result.
          </p>
          <p>
            If we believe, in our absolute discretion, that you are in breach of these terms of use,
            we may take any action that we deem is reasonably necessary to remedy such breach or
            protect the Service in the circumstances, including without limitation:
          </p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              suspending or terminating your registered account and access to our Services;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              removing any Customer Content uploaded by you to the Service; and
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              commencing legal proceedings to prevent you from using our Services.
            </li>
          </ul>
          <p>
            Upon termination of your account, and/or access to the Services, you must immediately
            cease using or accessing the Services, and uninstall and delete all copies, full or
            partial, of the Services from your computer or device (as applicable).
          </p>
          <p style="page-break-after: avoid;">
            <strong>Warranties and disclaimers</strong>
          </p>
          <p>
            To the maximum extent permitted by law, including the Australian Consumer Law, we, and
            our directors, officers, agents, employees and contractors, make no warranties or
            representations about any of the Services or the RestSpace Content, including but not
            limited to warranties or representations that they will be complete, accurate or
            up-to-date, that access will be uninterrupted or error-free or free from viruses, or
            that the Services will be secure.
          </p>
          <p>
            We are not liable for any breach of these terms of use (including any warranty contained
            in them) which arises as the result of:
          </p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              modifications to any of the Services that were effected or attempted by a person other
              than us or our authorised representatives;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              access and use of the Services;
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              any act, error, fault, neglect, misuse or omission of you; or
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              the operation of any of the Services other than in accordance with these terms of use,
              or otherwise than in accordance with our directions or recommendations.
            </li>
          </ul>
          <p>
            We reserve the right to restrict, suspend or terminate without notice your access to any
            or all of the Services, any RestSpace Content, or any feature of the Services at any
            time without notice and we will not be responsible for any loss, cost, damage or
            liability that may arise as a result.
          </p>
          <p>
            The Services are not designed, developed, or intended for use in environments or
            applications that may lead to death, personal injury, or physical property or
            environmental damage.
          </p>
          <p>
            When you use any map data, traffic, directions, and other content in the Services, you
            may find that actual conditions differ from the map results and content, so exercise
            your independent judgment and use the Services at your own risk and cost. You should not
            follow any navigational route suggestions that appear to be hazardous, unsafe, or
            illegal. You are responsible at all times for your conduct and its consequences.
          </p>
          <p>
            The Services are intended as a reference tool only. The Services must not to be used as
            the primary means of operating a vehicle or other form of transportation. Use and
            interpretation of the Services is your responsibility, as is compliance with road safety
            and traffic laws. Neither we nor any of our third party licensors makes any
            representation or warranty that using the Services will prevent liability under any law.
            You acknowledge and agree that the Services may contain inaccurate or incomplete
            information due to the passage of time, changing circumstances, sources used, and the
            nature of collecting comprehensive geographic data, any of which may lead to incorrect
            results.
          </p>
          <p>
            Neither we nor any of our directors, officers, agents, employees, contractors or third
            party licensors will have any liability for fines or any other penalty for contravention
            of traffic or other relevant law, or for any accident. You must not use the Services in
            a way that violates any law, including, but not limited to, by possessing or using data
            with regard to speed cameras or other traffic monitoring or enforcement devices in a
            jurisdiction, or in a way, that violates applicable law.
          </p>
          <p>
            In certain jurisdictions, the Services or certain uses of the Services might be in
            conflict with law. You will indemnify us and our directors, officers, agents, employees,
            contractors and third party licensors against any claim, suit, damages, or sanction
            associated with any possession or use by you of the Services in violation of law, except
            where to do so would contravene legislation (including the Australian Consumer Law) or
            cause part or all of this clause to be void.
          </p>
          <p>
            <strong>Limitation of Liability</strong>
          </p>
          <p>
            To the maximum extent permitted by law, including the Australian Consumer Law, in no
            event shall we be liable for any direct loss, damage or expense, or any indirect,
            economic, special or consequential loss or damage, including loss of revenue, time,
            goodwill, data, anticipated savings, opportunity, loss of production, and loss of profit
            &ndash; irrespective of the manner in which it occurs, including negligence &ndash;
            which may be suffered due to your use of the Services and/or the information or
            materials contained on any of the Services, or as a result of the inaccessibility of any
            of the Services and/or the fact that certain information or materials contained on any
            of the Services are incorrect, incomplete or not up-to-date.
          </p>
          <p>Where our liability cannot be lawfully excluded, it is limited at our option to:</p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              the resupplying of access to and use of the relevant Service(s);
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              the payment of the cost of having access to and use of the relevant Service(s)
              supplied again; or
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              the refund of the amounts paid by you for your subscription to access and use the
              relevant Service(s).
            </li>
          </ul>
          <p>
            Notwithstanding the above, our total liability in relation to the performance or
            otherwise of our obligations under these terms of use (including in respect of any
            liabilities, losses, damage, damages, penalties, fines, taxes, judgments, costs and
            legal and other expenses, whether arising in tort (including negligence) or otherwise)
            in each 12 month period commencing on the date you accept these terms of use and each
            anniversary of that date (each a 'Service Year') will not exceed the fees
            for the Services actually paid to us in respect of that Service Year.
          </p>
          <p>
            <strong>Apple Specific Terms</strong>
          </p>
          <p>
            The following terms apply only where you have purchased a Service from the Apple App
            Store.
          </p>
          <p>
            You acknowledge that these terms of use are concluded between you and us only, and not
            with Apple, and that we, and not Apple, are solely responsible for the Service and their
            RestSpace Content.
          </p>
          <p>
            Apple is not responsible for any maintenance and support in connection with the
            Services.
          </p>
          <p>
            We, and not Apple, are responsible for addressing any of your claims or any third party
            claims relating to the Services including, but not limited to:
          </p>
          <ul>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">product liability claims;</li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              any claim that a Service fails to conform to any applicable legal or regulatory
              requirement; and
            </li>
            <li style="margin-left: 18.0pt; text-indent: -18.0pt;">
              claims arising under the Australian Consumer Law or similar legislation.
            </li>
          </ul>
          <p>All complaints and claims regarding the Services should be directed to us.</p>
          <p>
            In the event of any failure of the Service to conform to any applicable guarantee or
            warranty, which cannot be excluded by law, you may notify Apple, and Apple will refund
            the purchase price for the Service to you. To the maximum extent permitted by applicable
            law, Apple will have no other guarantee or warranty obligation whatsoever with respect
            to the Service, and any other claims, losses, liabilities, damages, costs or expenses
            attributable to any failure to conform to any warranty will be our sole responsibility
            subject to these terms of use.
          </p>
          <p>
            If there are any third party claims relating to intellectual property rights regarding
            the Services, we will be responsible, and not Apple, for any investigation, defence,
            settlement and discharge of any such claim.
          </p>
          <p>
            You acknowledge that Apple and its subsidiaries are beneficiaries of these terms of use
            and that your acceptance of these terms of use gives Apple the right (and you will be
            deemed to have accepted that right) to enforce these terms of use.
          </p>
          <p>
            <strong>Force Majeure</strong>
          </p>
          <p>
            We are not responsible for any loss arising out of any occurrences or conditions beyond
            our control, including but not limited to acts of terrorism, acts of God, defects in
            vehicles, war, strikes, theft, delay, cancellation, civil disorder, disaster, Government
            regulations or changes in itinerary or schedule.
          </p>
          <p>
            <strong>Jurisdiction and governing law</strong>
          </p>
          <p>
            Your use of the Services and these terms of use are governed by the law of Queensland
            and you submit to the non-exclusive jurisdiction of the courts exercising jurisdiction
            in Queensland.
          </p>
          <p>
            <strong>Waiver</strong>
          </p>
          <p>
            If we elect not to exercise or enforce any right that we have against you at a
            particular time, this does not prevent us from later seeking to exercise or enforce that
            right.
          </p>
          <p style="page-break-after: avoid;">
            <strong>Severance</strong>
          </p>
          <p>
            If any clause, or part of any clause, of these terms or use are held to be invalid,
            unenforceable or illegal for any reason, the remaining terms and conditions, or part of
            those terms and conditions, will nevertheless continue in full force.
          </p>
          <p>
            <strong>Contacting us</strong>
          </p>
          <p>
            If you have any questions or concerns about our terms of use, you may contact us at{' '}
            <a href="mailto:restspacesupport@proroute.co" title="restspacesupport@proroute.co">
              restspacesupport@proroute.co
            </a>
            .
          </p> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
