import { Dimensions } from "react-native";
import BootSplash from "react-native-bootsplash";
import { useTranslation } from "react-i18next";
import Animated, {
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { useOnboardingStore } from "~/modules/scanning/services/Onboarding";

import { SafeContainer } from "~/components/Containment/SafeContainer";
import { StyledText, TStyledText } from "~/components/Typography/StyledText";

/**
 * Informs user with what's being done while displaying the app icon. This
 * screen is to prevent the user from being able to use the app in it's
 * unoptimal state.
 */
export function OnboardingScreen() {
  const { container, logo } = BootSplash.useHideAnimation({
    manifest: require("../../assets/bootsplash/manifest.json"),
    logo: require("../../assets/bootsplash/logo.png"),

    animate: () => {},
  });

  const opacity = useAnimatedStyle(() => ({
    opacity: withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(3000, withTiming(1, { duration: 750 })),
    ),
  }));

  return (
    <SafeContainer animated {...container} exiting={FadeOut.duration(500)}>
      <Animated.Image {...logo} style={[logo.style]} />

      <Animated.View
        layout={LinearTransition}
        style={[{ width: Dimensions.get("window").width - 32 }, opacity]}
        className="absolute bottom-8 left-4 gap-1 rounded-md bg-surface p-4"
      >
        <OnboardingPhase />
      </Animated.View>
    </SafeContainer>
  );
}

function OnboardingPhase() {
  const { t } = useTranslation();
  const store = useOnboardingStore((state) => state);

  if (store.phase === "preprocess") {
    return (
      <>
        <TStyledText textKey="feat.onboardPreprocess.title" />
        <TStyledText dim textKey="feat.onboardPreprocess.brief" />
      </>
    );
  } else if (store.phase === "tracks") {
    return (
      <>
        <TStyledText textKey="feat.onboardTracks.title" />
        <StyledText dim>
          {`${t("feat.onboardTracks.extra.prevSaved", { amount: store.prevSaved })}\n\n`}
          {`${t("feat.onboardTracks.extra.saved", { amount: store.staged, total: store.unstaged })}\n`}
          {`${t("feat.onboardTracks.extra.errors", { amount: store.saveErrors })}`}
        </StyledText>
      </>
    );
  }

  return (
    <>
      <TStyledText textKey="feat.onboardImages.title" />
      <StyledText dim>
        {`${t("feat.onboardImages.extra.checked", { amount: store.checked, total: store.unchecked })}\n`}
        {`${t("feat.onboardImages.extra.found", { amount: store.found })}`}
      </StyledText>
    </>
  );
}
