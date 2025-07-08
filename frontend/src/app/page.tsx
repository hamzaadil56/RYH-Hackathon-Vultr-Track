'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserAvatar } from "@/components/UserAvatar";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    // Redirect authenticated users to agents page
    // router.push('/agents');
    // return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen  relative overflow-hidden flex flex-col">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" width="1440" height="997" viewBox="0 0 1440 997" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Original background path */}
          <path opacity="0.1" d="M348.955 31.5217C365.886 29.2877 375.052 28.5124 383.963 26.8322C431.254 17.9555 478.1 7.59589 526.919 8.14276C571.794 8.65235 615.456 15.3149 659.693 22.0597C745.175 35.1174 820.09 72.4708 893.161 114.921C914.928 127.559 935.741 143.054 953.818 160.547C994.616 200.089 1036.05 238.696 1068.58 286.638C1109.06 346.175 1142.03 408.542 1161.25 477.579C1172.14 516.772 1183.21 557.008 1185.44 597.25C1188.43 651.339 1191.1 705.861 1180.67 760.351C1171.82 806.595 1161.25 851.921 1144.58 895.867C1141.84 903.09 1138.98 910.261 1134.71 921.289C1155.72 910.974 1171.31 900.704 1188.49 895.536C1213.76 887.926 1230.57 870.598 1243.11 850.292C1262.71 818.673 1279.64 785.322 1296.06 751.869C1333.68 674.916 1347.56 591.561 1352.46 507.532C1355.96 447.557 1341.7 388.364 1326.17 329.942C1311.21 273.548 1289.89 220.745 1258.38 171.447C1238.08 139.744 1214.4 111.109 1191.55 81.5188C1162.08 43.4147 1125.93 14.105 1087.99 -13.824C1046.87 -44.0884 1002.07 -68.8811 954.774 -87.1247C890.806 -111.821 825.246 -132.705 754.849 -129.861C719.587 -128.436 684.262 -129.791 649.001 -129.008C637.097 -128.741 625.068 -126.648 613.42 -123.829C578.476 -115.346 542.834 -108.537 509.034 -96.4718C475.109 -84.3306 443.03 -66.7608 410.251 -51.304C406.05 -49.3251 401.594 -46.4359 399.048 -42.7391C383.517 -20.3273 368.495 2.44699 348.955 31.5217ZM1167.04 664.238C1163.61 628.234 1162.02 591.937 1156.22 556.308C1150.88 523.256 1143.94 489.887 1132.61 458.483C1110.14 396.019 1080.29 337.017 1039.49 283.902C1002.38 235.591 960.31 192.504 911.364 156.207C863.626 120.775 811.624 93.0688 756.186 71.6047C696.228 48.3974 633.405 37.8918 570.011 32.0375C499.486 25.5276 430.873 41.7034 362.195 54.4369C352.265 56.2628 339.918 62.4798 335.144 70.504C322.796 91.1215 311.783 113.177 304.464 136.003C295.744 163.27 292.243 192.167 284.923 219.949C269.775 277.157 270.922 335.681 276.077 393.219C279.769 434.461 289.253 475.811 302.11 516.155C316.113 559.974 332.661 602.144 355.511 642.055C378.426 682.082 406.941 717.609 435.837 753.429C464.543 788.924 498.66 816.579 534.368 843.49C593.88 888.339 659.948 919.616 731.808 938.286C771.208 948.531 811.053 960.049 851.28 963.562C928.741 970.32 1005.31 961.799 1080.23 938.636C1100.15 932.47 1111.16 921.639 1118.23 903.917C1148.97 827.059 1165.71 747.523 1167.04 664.238ZM449.012 -100.437C469.507 -107.156 490.066 -113.654 510.498 -120.641C572.429 -141.857 635.505 -156.009 701.511 -152.407C710.039 -151.943 718.569 -152.025 727.034 -152.388C799.021 -155.513 867.509 -141.844 935.613 -117.771C1014.28 -89.995 1084.94 -49.9496 1147.44 3.79587C1199.76 48.8173 1242.66 102.181 1279.19 161.717C1339.28 259.689 1366.08 366.633 1375.88 479.126C1378.11 505.407 1373.59 531.745 1370.53 558.172C1363.53 619.427 1352.33 679.141 1327.19 735.643C1312.48 768.662 1296.7 801.217 1281.42 833.983C1280.47 835.625 1279.51 837.267 1278.56 838.909C1279.45 837.222 1280.4 835.542 1281.3 833.856C1285.88 832.583 1291.61 832.64 1294.85 829.828C1333.23 796.636 1371.11 762.464 1401.78 722.152C1450.92 657.659 1489.62 587.304 1510.05 507.844C1522.91 457.789 1535 407.944 1536.72 355.745C1538.82 293.638 1530.17 233.249 1514.44 173.592C1493.95 96.0342 1460.21 24.9481 1412.03 -39.5768C1379.38 -83.3511 1342.72 -123.091 1300.39 -157.326C1262.77 -187.705 1222.48 -214.604 1178.63 -234.979C1135.09 -255.215 1090.28 -272.905 1042.61 -281.477C1011.93 -287.001 981.251 -294.827 950.317 -295.986C907.036 -297.615 863.69 -299.148 820.153 -290.78C764.587 -280.109 708.766 -272.186 657.91 -245.402C630.223 -230.856 601.325 -218.524 574.593 -202.5C527.938 -174.584 483.065 -144.014 449.012 -100.412C448.058 -98.8332 447.04 -97.2556 446.021 -95.6709C447.04 -97.2618 447.994 -98.8519 449.012 -100.437ZM989.398 1096.79C977.941 1100.08 965.784 1101.89 955.155 1106.92C902.262 1131.98 845.105 1141.01 788.139 1147.13C755.486 1150.63 722.133 1152.12 688.335 1149.81C621.885 1145.24 557.473 1134.36 494.967 1111.48C404.076 1078.19 324.259 1026.83 256.6 958.261C203.134 904.07 159.979 841.97 128.154 771.965C88.182 684.067 64.3771 593.293 68.5137 496.078C69.6605 468.2 65.0771 439.393 70.5517 412.502C87.6086 327.741 108.105 243.667 155.842 169.437C157.051 167.598 156.542 164.696 156.86 162.291C157.879 160.642 158.834 158.988 159.852 157.339C158.897 159.038 157.943 160.744 157.051 162.449C150.686 165.383 142.73 166.803 138.211 171.499C102.885 208.057 66.8596 244.036 33.6975 282.509C-27.4689 353.589 -57.8299 439.973 -82.6535 528.577C-86.5361 542.373 -90.3549 556.862 -90.1637 570.982C-89.2733 642.266 -99.3297 714.013 -83.3535 784.68C-78.0701 807.989 -68.2049 830.306 -63.4312 853.678C-52.8651 905.668 -27.0237 950.39 0.0910878 994.667C42.1635 1063.59 97.156 1121.1 161.315 1169.48C208.671 1205.19 260.673 1233.72 316.939 1253C365.759 1269.71 414.005 1290.07 467.407 1286.81C527.492 1304.09 588.278 1292.17 647.026 1283.45C707.111 1274.54 766.497 1255.41 820.408 1224.63C844.468 1210.91 868.464 1196.99 891.633 1181.88C928.167 1158.12 962.728 1131.97 989.207 1096.65C990.226 1095.05 991.307 1093.45 992.326 1091.86C991.307 1093.5 990.352 1095.15 989.398 1096.79ZM1084.3 965.388C1074.75 966.565 1065.08 967.272 1055.59 969.003C1023.83 974.844 992.262 984.625 960.246 986.349C897.551 989.728 834.984 987.647 772.862 973.73C711.185 959.922 651.609 939.921 596.807 910.141C512.216 864.171 438.383 803.496 380.844 725.079C338.517 667.324 304.018 604.543 282.823 536.467C258.763 459.17 244.761 379.29 251.826 297.501C254.308 268.865 257.745 240.122 263.601 212.021C273.085 166.783 282.696 121.456 303.891 76.3517C289.379 82.0218 278.75 84.8598 269.457 90.065C246.479 102.932 220.51 111.892 204.279 134.387C143.175 219.244 105.749 314.803 93.6566 417.484C86.2093 480.552 85.4455 545.681 98.8118 609.488C109.696 661.419 123.508 712.289 146.168 760.41C184.166 841.123 236.359 910.974 303.637 970.014C377.47 1034.81 460.787 1081.39 555.943 1105.92C580.258 1112.19 605.718 1113.68 630.223 1119.33C685.599 1132.08 741.929 1128.86 796.858 1123.44C853.697 1117.84 910.091 1103.42 963.62 1080.42C1018.55 1056.81 1065.4 1026.07 1084.17 965.267C1085.13 963.683 1086.15 962.099 1087.16 960.514C1086.21 962.143 1085.25 963.766 1084.3 965.388ZM1179.01 928.697C1142.35 941.199 1113.68 967.121 1093.02 1006.46C1125.86 978.452 1157.56 959.464 1179.27 928.92C1180.35 928.404 1181.56 928.061 1182.38 927.297C1182.89 926.8 1182.89 925.7 1183.15 924.866C1181.75 926.146 1180.41 927.418 1179.01 928.697ZM339.535 1.84924C321.586 9.17318 286.133 38.7066 266.083 63.6698C305.801 58.7893 329.097 38.0001 339.408 1.71564C340.426 -0.00223672 341.381 -1.72089 342.399 -3.43915C341.444 -1.6766 340.489 0.0863796 339.535 1.84924ZM548.115 1317C390.582 1314.33 259.4 1271.6 142.858 1182.83C53.4295 1114.75 -15.8213 1030.63 -61.331 928.76C-90.2275 864.095 -111.868 796.134 -114.032 723.769C-114.669 703.419 -120.589 683.081 -119.952 662.87C-116.387 547.965 -90.6097 438.19 -32.4975 338.456C-1.56468 285.404 33.8894 234.044 80.0992 192.746C115.997 160.693 155.969 133.222 194.095 103.702C198.806 100.031 204.661 97.0845 208.099 92.4265C254.053 30.1219 313.184 -17.1968 378.17 -58.0504C385.108 -62.4283 390.518 -69.4532 396.31 -75.5747C422.98 -103.714 447.166 -134.717 476.7 -159.458C509.735 -187.177 544.168 -213.331 582.869 -234.528C631.878 -261.419 682.352 -282.565 735.945 -297.532C808.824 -317.901 883.358 -325.175 958.337 -318.71C999.9 -315.126 1041.15 -304.85 1081.88 -294.917C1166.41 -274.293 1239.8 -231.467 1308.98 -179.541C1382.18 -124.612 1437.68 -54.429 1480.58 24.2805C1518.52 93.9028 1542.58 169.653 1553.21 249.647C1557.85 284.799 1557.85 319.474 1558.87 354.415C1560.08 395.669 1552.57 436.147 1543.34 475.849C1524.88 555.162 1493.18 629.799 1447.99 697.341C1406.88 758.825 1358.12 814.403 1295.74 856.255C1280.79 866.316 1265.32 875.752 1250.62 886.233C1242.79 891.814 1234.83 898.038 1229.17 905.623C1183.34 966.375 1125.86 1013.76 1061.7 1053.69C1057.63 1056.19 1053.43 1059.07 1050.63 1062.8C1013.52 1112.94 968.075 1155.26 918.301 1191.69C880.557 1219.33 838.804 1243.04 795.84 1261.66C750.902 1281.16 703.102 1295.71 655.174 1306.38C616.665 1314.96 576.184 1314.49 548.115 1317Z" fill="url(#paint0_linear_14_44)" />
          {/* Animated Circles */}
          <circle cx="200" cy="300" r="80" fill="url(#circleGradient1)" opacity="0.3">
            <animate attributeName="cy" values="300;250;300" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="1200" cy="400" r="60" fill="url(#circleGradient2)" opacity="0.4">
            <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="700" r="40" fill="url(#circleGradient3)" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" values="0 300 700;360 300 700" dur="8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="1100" cy="200" r="50" fill="url(#circleGradient4)" opacity="0.3">
            <animate attributeName="cx" values="1100;1150;1100" dur="7s" repeatCount="indefinite" />
            <animate attributeName="cy" values="200;250;200" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="800" r="70" fill="url(#circleGradient5)" opacity="0.2">
            <animate attributeName="r" values="70;90;70" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="720" cy="500" r="100" fill="url(#circleGradient6)" opacity="0.1">
            <animate attributeName="cy" values="500;450;500" dur="8s" repeatCount="indefinite" />
            <animate attributeName="r" values="100;120;100" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="1300" cy="150" r="30" fill="url(#circleGradient7)" opacity="0.4">
            <animate attributeName="cy" values="150;180;150" dur="4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="0 1300 150;360 1300 150" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="1350" cy="750" r="45" fill="url(#circleGradient8)" opacity="0.3">
            <animate attributeName="cx" values="1350;1300;1350" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
          </circle>

          <defs>
            <linearGradient id="paint0_linear_14_44" x1="719.5" y1="-321" x2="719.5" y2="1317" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2F80ED" />
              <stop offset="1" stopColor="#6FCF97" />
            </linearGradient>

            {/* Circle gradients */}
            <linearGradient id="circleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3887F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3AC7A7" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="circleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3AC7A7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3887F6" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="circleGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#6FCF97" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="circleGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6FCF97" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="circleGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3887F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3AC7A7" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="circleGradient6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3AC7A7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3887F6" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="circleGradient7" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6FCF97" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="circleGradient8" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6FCF97" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>




        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center text-center z-10 relative px-4 py-8 sm:py-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] bg-clip-text text-transparent mb-4 sm:mb-6">Hired Mind</h1>
          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#5A6A7A] dark:text-[#94A3B8] mb-8 sm:mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <Button
            className="bg-[#3887F6] hover:bg-[#2563eb] text-white px-10 py-6 rounded-full text-lg font-semibold shadow transition w-full sm:w-auto cursor-pointer"
            onClick={() => {
              if (isAuthenticated) {
                router.push("/agents");
              } else {
                router.push("/register?tab=login");
              }
            }}
          >
            Lets get Started
          </Button>
        </main>
      </div>
    </Suspense>
  );
}
