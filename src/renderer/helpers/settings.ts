export type IRecentProject = { name: string; path: string };

class Settings {
  static RECENT_PROJ_KEY = 'recent-projects';

  recentProjects!: IRecentProject[];

  public load() {
    if (!this.recentProjects) {
      let recentProjects;
      try {
        const jsonData = localStorage.getItem(Settings.RECENT_PROJ_KEY);
        if (jsonData) {
          recentProjects = JSON.parse(jsonData);
        } else {
          recentProjects = [];
        }
      } catch (err) {
        console.log(err);
        recentProjects = [];
      }

      this.recentProjects = recentProjects;
    }
  }

  public registerProject(project: IRecentProject) {
    const index = this.recentProjects.findIndex((it) => it.path === project.path);
    if (index > -1) {
      this.recentProjects.splice(index, 1);
      this.recentProjects.unshift(project);
    } else {
      this.recentProjects.unshift(project);
    }

    localStorage.setItem(Settings.RECENT_PROJ_KEY, JSON.stringify(this.recentProjects));
  }
}

const settings = new Settings();
settings.load();

export default settings;
