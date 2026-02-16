const StorybookSpread = () => {
  return (
    <section className="storybook-section" id="storybook">
      <div className="storybook-spread">
        <div className="storybook-left">
          <div className="storybook-spine">Volume III</div>
          <div className="storybook-head">
            <span className="storybook-kicker">Storybook Studio</span>
            <h2>Chapter One: The Quiet Cut</h2>
            <p className="storybook-deck">
              An editorial view of video production where every frame reads like a page
              from a well-loved story.
            </p>
          </div>
          <div className="storybook-meta">
            <span>Issue 05</span>
            <span>Craft + Culture</span>
          </div>
          <div className="storybook-illustration">
            <span>Illustrated from field notes</span>
          </div>
          <div className="storybook-stamp">Est. 2012</div>
        </div>

        <div className="storybook-right">
          <article className="storybook-article">
            <p className="storybook-dropcap">
              In the margin of every brief lives a small, stubborn story. We chase it
              through research, sketches, and a dozen test edits until the message is
              clear enough to be read aloud.
            </p>
            <p>
              Our crews think like editors and our editors think like writers. The
              result is a visual language that feels printed, intentional, and layered
              with small discoveries.
            </p>
            <div className="storybook-pullquote">
              <p>“Make the story feel inevitable, then let the footage surprise.”</p>
              <span>— The Editors</span>
            </div>
            <p>
              From documentary vignettes to branded shorts, we build a narrative rhythm
              that can scale across campaigns without losing its warmth.
            </p>
          </article>

          <aside className="storybook-sidebar">
            <div className="storybook-note">
              <h3>Editor&apos;s note</h3>
              <p>
                We storyboard with pencil and ink before pixels. It keeps the pacing
                honest and the compositions deliberate.
              </p>
            </div>
            <div className="storybook-chapters">
              <h3>Inside this issue</h3>
              <ul className="storybook-list">
                <li>
                  <span>01</span> The brief that became a folktale.
                </li>
                <li>
                  <span>02</span> Casting real voices, not stock characters.
                </li>
                <li>
                  <span>03</span> Color grading like watercolor washes.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default StorybookSpread
